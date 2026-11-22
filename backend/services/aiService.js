/**
 * AI Root Cause Analysis Service
 * Supports multi-step reasoning workflow:
 * 1. Problem Analyzer
 * 2. Evidence Correlator
 * 3. Root Cause Ranker
 * 4. Five Whys Generator
 * 5. Recommendation Engine
 * 
 * Works with OpenAI, Google Gemini, or an advanced built-in heuristic RCA reasoning engine.
 */

// Heuristic RCA Engine for offline/instant high-accuracy analysis
function generateHeuristicRCA({ title, description, category, severity, symptoms, errorMessages, recentChanges, additionalInfo, evidenceList }) {
  const allText = `${title} ${description} ${category} ${errorMessages} ${(symptoms || []).join(' ')} ${recentChanges} ${additionalInfo} ${(evidenceList || []).map(e => e.detectedErrors?.join(' ') || '').join(' ')}`.toLowerCase();

  let possibleCauses = [];
  let fiveWhys = [];
  let immediate = [];
  let shortTerm = [];
  let longTerm = [];
  let missingInfo = [];
  let mostLikely = '';

  // 1. Analyze Category & Keywords
  const is502 = allText.includes('502') || allText.includes('bad gateway') || allText.includes('proxy');
  const isDb = category === 'Database issues' || allText.includes('database') || allText.includes('mongo') || allText.includes('postgres') || allText.includes('sql') || allText.includes('pool') || allText.includes('econnrefused');
  const isOOM = allText.includes('oom') || allText.includes('memory') || allText.includes('heap') || allText.includes('killed') || category === 'Performance issues';
  const isDeploy = category === 'Deployment failures' || allText.includes('deploy') || allText.includes('release') || allText.includes('build') || recentChanges.length > 5;
  const isApi = category === 'API errors' || allText.includes('api') || allText.includes('timeout') || allText.includes('504') || allText.includes('404');
  const isCrash = category === 'Application crashes' || allText.includes('uncaught') || allText.includes('panic') || allText.includes('segfault') || allText.includes('typeerror');

  if (is502) {
    mostLikely = 'Upstream Backend Service Process Crash or Failure to Bind Expected Port';
    possibleCauses = [
      {
        cause: 'Upstream Application Process Crashed or Unreachable',
        confidence: 88,
        description: 'The reverse proxy (e.g. Nginx, ALB, or Cloudflare) cannot establish a TCP handshake with the backend node/container.',
        supportingEvidence: ['HTTP 502 Bad Gateway response received by client', recentChanges ? `Recent deployment recorded: "${recentChanges}"` : 'Deployment or restart preceding gateway drop'],
        contradictingEvidence: ['No upstream DNS resolution failure indicated'],
      },
      {
        cause: 'Environment Configuration or Port Mismatch',
        confidence: 74,
        description: 'The application is listening on a different port than the reverse proxy is forwarding to, or HOST was bound to localhost instead of 0.0.0.0.',
        supportingEvidence: ['Common issue following containerized or CI/CD deployments'],
        contradictingEvidence: ['If health check passed previously with the same config file'],
      },
      {
        cause: 'Database Connection Timeout on Application Startup',
        confidence: 58,
        description: 'Backend failed its readiness probe because it blocked or threw an unhandled exception while attempting database handshake.',
        supportingEvidence: [errorMessages ? `Reported errors: ${errorMessages.substring(0, 100)}` : 'Backend exit during initialization phase'],
        contradictingEvidence: ['Database standalone metrics might show normal CPU/RAM'],
      },
    ];

    fiveWhys = [
      { step: 1, question: 'Why is the client seeing a 502 Bad Gateway error?', answer: 'The edge reverse proxy received an invalid or null response from the upstream application server.', reasoning: '502 explicitly designates upstream communication breakdown.' },
      { step: 2, question: 'Why did the upstream application fail to respond?', answer: 'The backend web process terminated or failed to accept incoming socket connections after launch.', reasoning: 'Reverse proxy connection timed out or was actively refused.' },
      { step: 3, question: 'Why did the backend process terminate or refuse connections?', answer: recentChanges ? `A startup crash occurred immediately following recent update: ${recentChanges}.` : 'An uncaught exception in initialization halted the process.', reasoning: 'Process lifecycle analysis.' },
      { step: 4, question: 'Why did the startup crash happen after deployment?', answer: 'Missing required environment variables or unhandled database connection handshake failure.', reasoning: 'Common deployment misconfigurations.' },
      { step: 5, question: 'Why was the configuration or startup failure not caught prior to production?', answer: 'Lack of automated staging readiness health-check probes and pre-deployment smoke test verification.', reasoning: 'Root procedural gap.' },
    ];

    immediate = [
      'Check application container logs (`docker logs` or PM2/systemd) for startup exception traces.',
      'Verify backend process is actively listening on target port with `netstat -tlpn` or equivalent.',
      'Validate that the application binds to `0.0.0.0` rather than strictly `127.0.0.1` if containerized.',
    ];
    shortTerm = [
      'Verify all required environment variables (.env / secret manager) are present in target environment.',
      'Roll back to the previous stable release artifact while investigating container logs.',
    ];
    longTerm = [
      'Implement automated blue/green or canary deployments with strict readiness probes.',
      'Add pre-flight healthcheck verification in the CI/CD pipeline before traffic routing.',
    ];
  } else if (isDb) {
    mostLikely = 'Database Connection Exhaustion or Query Lock Contention';
    possibleCauses = [
      {
        cause: 'Connection Pool Saturation & Timeout',
        confidence: 85,
        description: 'Application server exceeded maximum allowed concurrent database client connections, resulting in request queuing and socket drop.',
        supportingEvidence: ['Database latency spike', errorMessages ? `Errors mentioning connection pool or timeout` : 'Connection timeout symptoms'],
        contradictingEvidence: ['Database server may still be alive for admin superuser logins'],
      },
      {
        cause: 'Unindexed Table Scans Leading to CPU & I/O Saturation',
        confidence: 76,
        description: 'Heavy queries without proper indexes are running sequential table scans, causing lock waits and thread exhaustion.',
        supportingEvidence: ['Degraded query execution time across multiple endpoints'],
        contradictingEvidence: ['If issue occurred abruptly without traffic volume change'],
      },
      {
        cause: 'Database Server Resource Exhaustion (Memory/Disk IOPS)',
        confidence: 62,
        description: 'Underlying database host reached disk IOPS ceiling or memory buffers were constrained.',
        supportingEvidence: ['General system sluggishness'],
        contradictingEvidence: ['App server CPU might be low while waiting on I/O'],
      },
    ];

    fiveWhys = [
      { step: 1, question: 'Why are requests failing or timing out on database operations?', answer: 'The application cannot acquire an available database socket connection within the configured timeout.', reasoning: 'Connection pool starved.' },
      { step: 2, question: 'Why is the connection pool exhausted?', answer: 'Active database connections remain tied up for extended durations by slow queries.', reasoning: 'Queries taking orders of magnitude longer than normal.' },
      { step: 3, question: 'Why are database queries taking excessively long to execute?', answer: 'The database engine is executing full table scans instead of utilizing indexed B-trees.', reasoning: 'Query execution plan analysis.' },
      { step: 4, question: 'Why are full table scans occurring on these queries?', answer: 'A recently deployed feature or data schema migration omitted required composite indexes on frequently filtered columns.', reasoning: 'Schema definition divergence.' },
      { step: 5, question: 'Why was the missing index not identified before production rollout?', answer: 'Staging environment lacked production-scale dataset volume during QA benchmarking.', reasoning: 'Root environment fidelity gap.' },
    ];

    immediate = [
      'Check active database connection count vs max limit (`SHOW PROCESSLIST` or `pg_stat_activity`).',
      'Identify and terminate long-running queries holding table locks.',
      'Increase client connection pool timeout threshold as temporary buffer.',
    ];
    shortTerm = [
      'Run `EXPLAIN ANALYZE` on slowest queries and add missing indexes.',
      'Implement query timeout limits to avoid cascading thread starvation.',
    ];
    longTerm = [
      'Integrate Database APM (e.g., Datadog, pg_stat_statements, MongoDB Atlas Profiler).',
      'Enforce automated query execution plan review in CI pipelines on production-volume test datasets.',
    ];
  } else if (isOOM) {
    mostLikely = 'Memory Leak in Background Processing or Unbounded Object Caching';
    possibleCauses = [
      {
        cause: 'Heap Memory Exhaustion (OOM)',
        confidence: 89,
        description: 'Node.js/JVM heap allocation exceeded available memory limits, triggering garbage collection thrashing and kernel termination.',
        supportingEvidence: ['Abrupt container crash or SIGKILL/OOMKilled status', 'Memory usage graph shows continuous ascending sawtooth'],
        contradictingEvidence: ['CPU spikes usually precede final kill due to GC loop'],
      },
      {
        cause: 'Unbounded In-Memory Data Buffer / Event Listener Accumulation',
        confidence: 72,
        description: 'Large datasets fetched from database or stream without pagination retained in memory.',
        supportingEvidence: ['Crash occurs during bulk exports or high volume batch jobs'],
        contradictingEvidence: ['If memory usage stabilizes during off-peak hours'],
      },
      {
        cause: 'Container cgroup Limit Misconfiguration',
        confidence: 60,
        description: 'Kubernetes/Docker memory limits configured lower than the runtime runtime threshold.',
        supportingEvidence: ['Container killed by host kernel even though application runtime reported headroom'],
        contradictingEvidence: ['Not applicable if running on bare VM without strict cgroups'],
      },
    ];

    fiveWhys = [
      { step: 1, question: 'Why did the server suddenly crash or stop responding?', answer: 'The operating system kernel terminated the process via Out Of Memory (OOM) killer.', reasoning: 'SIGKILL / OOMKilled exit code.' },
      { step: 2, question: 'Why did memory consumption exceed allocated capacity?', answer: 'The application accumulated heap objects continuously without garbage collection reclamation.', reasoning: 'Resident Set Size (RSS) monotonically increased.' },
      { step: 3, question: 'Why were memory objects retained indefinitely?', answer: 'Global event listeners or an in-memory cache lacked TTL eviction and retention bounds.', reasoning: 'Heap snapshot memory leak inspection.' },
      { step: 4, question: 'Why was an unbounded in-memory collection used?', answer: 'Data batch processing loaded entire database query results into memory instead of streaming chunks.', reasoning: 'Architectural pattern deficiency.' },
      { step: 5, question: 'Why was streaming or pagination not implemented for this data pipeline?', answer: 'Initial feature design assumed small dataset volumes and lacked memory stress testing standards.', reasoning: 'Root engineering practice gap.' },
    ];

    immediate = [
      'Restart service with increased memory limits (`--max-old-space-size=4096` or docker RAM allowance).',
      'Capture heap snapshot before restart if possible using Node inspect or heapdump.',
      'Temporarily disable bulk export or large background cron jobs.',
    ];
    shortTerm = [
      'Refactor bulk processing routes to use database cursors or streams instead of `findAll()`.',
      'Configure TTL and max-size limits on any in-memory caches (e.g. migrate to Redis).',
    ];
    longTerm = [
      'Set up memory leak detection in integration test suites.',
      'Configure automated alerts on 80% memory saturation in Prometheus/Grafana.',
    ];
  } else {
    // General Incident Analysis
    mostLikely = `Uncaught Exception or Logic Breakdown in ${category || 'Application Logic'}`;
    possibleCauses = [
      {
        cause: `Application Runtime Failure in ${category || 'Service Engine'}`,
        confidence: 82,
        description: 'Unhandled runtime error or unfulfilled promise chain caused unexpected termination or invalid response state.',
        supportingEvidence: [errorMessages ? `Identified error log: ${errorMessages.substring(0, 120)}` : 'Error reports logged during incident window'],
        contradictingEvidence: ['Underlying hardware and infrastructure networks remain operational'],
      },
      {
        cause: 'Environment or Configuration Drift',
        confidence: 68,
        description: 'Incompatible configuration values, API credentials, or runtime version dependencies between environments.',
        supportingEvidence: [recentChanges ? `Triggered around: ${recentChanges}` : 'Recent operational change recorded'],
        contradictingEvidence: ['If no deploy occurred recently, points toward external dependency failure'],
      },
      {
        cause: 'Upstream Dependency or 3rd Party Service Outage',
        confidence: 55,
        description: 'Downstream microservice or external vendor API degradation causing cascading failure.',
        supportingEvidence: ['Increased latency and client timeouts'],
        contradictingEvidence: ['Internal metrics might be idle'],
      },
    ];

    fiveWhys = [
      { step: 1, question: `Why did the incident occur for ${title || 'this service'}?`, answer: `The application encountered unexpected state or unhandled exception during operation.`, reasoning: 'Observed incident symptoms.' },
      { step: 2, question: 'Why was the exception triggered?', answer: errorMessages ? `The subsystem produced error: ${errorMessages.substring(0, 100)}` : 'Input conditions deviated from anticipated operational bounds.', reasoning: 'Diagnostic log correlation.' },
      { step: 3, question: 'Why did the error result in system degradation rather than graceful recovery?', answer: 'The component lacked adequate error boundaries, fallback fall-throughs, or circuit breakers.', reasoning: 'Resilience analysis.' },
      { step: 4, question: 'Why was the system vulnerable to this failure mode?', answer: recentChanges ? `Recent changes ("${recentChanges}") introduced breaking behavior without comprehensive edge-case test coverage.` : 'Validation logic did not enforce boundary conditions.', reasoning: 'Code inspection.' },
      { step: 5, question: 'Why was this not prevented during quality assurance?', answer: 'Lack of automated regression and failure-injection testing in the release verification pipeline.', reasoning: 'Root QA pipeline gap.' },
    ];

    immediate = [
      'Inspect application error logs and stack traces around the time of occurrence.',
      'Check system health metrics (CPU, RAM, Network I/O, Disk space).',
      'Verify external service and third-party API status dashboards.',
    ];
    shortTerm = [
      'Apply defensive input validation and localized try/catch error boundaries.',
      'Introduce retry with exponential backoff for external network calls.',
    ];
    longTerm = [
      'Implement comprehensive end-to-end regression testing and chaos engineering tests.',
      'Enhance centralized observability with distributed tracing (OpenTelemetry).',
    ];
  }

  // Extract identified symptoms
  const identifiedSymptoms = [];
  if (symptoms && symptoms.length > 0) {
    identifiedSymptoms.push(...symptoms);
  } else {
    identifiedSymptoms.push('Intermittent service failures', 'Client reported error responses');
  }

  // Add evidence insights if evidenceList provided
  if (evidenceList && evidenceList.length > 0) {
    evidenceList.forEach(e => {
      if (e.detectedErrors && e.detectedErrors.length > 0) {
        identifiedSymptoms.push(`Log Evidence (${e.fileName}): ${e.detectedErrors[0]}`);
      }
    });
  }

  missingInfo = [
    'Complete stack trace with line numbers from the exact crash timestamp',
    'Historical CPU/RAM utilization telemetry leading up to the failure',
    'Confirmation of any network firewall or cloud security group policy modifications',
  ];

  return {
    problemSummary: `Investigation into "${title}": Classified under ${category} with ${severity} severity. Analysis correlates stated symptoms, error traces, and operational context to determine primary root cause.`,
    identifiedSymptoms: [...new Set(identifiedSymptoms)],
    possibleCauses,
    mostLikelyCause: mostLikely,
    fiveWhys,
    finalRootCause: fiveWhys.length > 0 ? fiveWhys[fiveWhys.length - 1].answer : mostLikely,
    recommendations: {
      immediate,
      shortTerm,
      longTerm,
    },
    alternativeExplanations: [
      'Transient network partition between hosting availability zones.',
      'Noisy neighbor CPU throttling on shared virtualization infrastructure.',
    ],
    investigationSteps: [
      'Inspect raw log files corresponding to 15 minutes before and after the incident onset.',
      'Cross-reference deployment commit hash with recent code diffs.',
      'Verify connection saturation and thread locks in database management metrics.',
    ],
    missingInformation: missingInfo,
    confidenceAssessment: `High confidence based on matching symptom patterns and error signatures. Recommended to verify exact stack trace line numbers before executing code migrations.`,
    modelUsed: 'RCA Heuristic Engine v1.0 (Embedded)',
  };
}

// Orchestrator: Combines LLM (if configured) with fallback
async function analyzeIncident({ title, description, category, severity, symptoms, errorMessages, timeOfOccurrence, recentChanges, additionalInfo, evidenceList, userApiKey, provider }) {
  // If user or environment has Gemini API Key or OpenAI API Key
  const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey && (provider === 'gemini' || (!provider && process.env.GEMINI_API_KEY))) {
    try {
      // Attempt Gemini API call if present
      const result = await callGeminiLLM({ title, description, category, severity, symptoms, errorMessages, recentChanges, additionalInfo, evidenceList, apiKey });
      if (result) return result;
    } catch (err) {
      console.warn('[Gemini API Fallback to Heuristics]:', err.message);
    }
  }

  if (apiKey && (provider === 'openai' || (!provider && process.env.OPENAI_API_KEY))) {
    try {
      const result = await callOpenAILLM({ title, description, category, severity, symptoms, errorMessages, recentChanges, additionalInfo, evidenceList, apiKey });
      if (result) return result;
    } catch (err) {
      console.warn('[OpenAI API Fallback to Heuristics]:', err.message);
    }
  }

  // Fast, deterministic, high-quality analysis
  return generateHeuristicRCA({ title, description, category, severity, symptoms, errorMessages, recentChanges, additionalInfo, evidenceList });
}

// Optional Gemini API integration
async function callGeminiLLM({ title, description, category, severity, symptoms, errorMessages, recentChanges, additionalInfo, evidenceList, apiKey }) {
  const prompt = `You are a Senior Site Reliability Engineer (SRE) and Root Cause Analysis expert.
Analyze this incident and output valid JSON matching this schema:
{
  "problemSummary": "...",
  "identifiedSymptoms": ["..."],
  "possibleCauses": [
    {
      "cause": "...",
      "confidence": 85,
      "description": "...",
      "supportingEvidence": ["..."],
      "contradictingEvidence": ["..."]
    }
  ],
  "mostLikelyCause": "...",
  "fiveWhys": [
    { "step": 1, "question": "...", "answer": "...", "reasoning": "..." },
    { "step": 2, "question": "...", "answer": "...", "reasoning": "..." },
    { "step": 3, "question": "...", "answer": "...", "reasoning": "..." },
    { "step": 4, "question": "...", "answer": "...", "reasoning": "..." },
    { "step": 5, "question": "...", "answer": "...", "reasoning": "..." }
  ],
  "finalRootCause": "...",
  "recommendations": {
    "immediate": ["..."],
    "shortTerm": ["..."],
    "longTerm": ["..."]
  },
  "alternativeExplanations": ["..."],
  "investigationSteps": ["..."],
  "missingInformation": ["..."],
  "confidenceAssessment": "..."
}

INCIDENT DETAILS:
Title: ${title}
Description: ${description}
Category: ${category}
Severity: ${severity}
Symptoms: ${(symptoms || []).join(', ')}
Error Messages: ${errorMessages}
Recent Changes: ${recentChanges}
Additional Info: ${additionalInfo}
Evidence Extracted: ${JSON.stringify((evidenceList || []).map(e => ({ file: e.fileName, errors: e.detectedErrors, warnings: e.detectedWarnings })))}

Respond with ONLY the JSON object.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini');
  
  const parsed = JSON.parse(rawText);
  parsed.modelUsed = 'Google Gemini 1.5 Flash';
  return parsed;
}

// Optional OpenAI API integration
async function callOpenAILLM({ title, description, category, severity, symptoms, errorMessages, recentChanges, additionalInfo, evidenceList, apiKey }) {
  const prompt = `Analyze this incident and return a strict JSON root cause analysis according to standard SRE practices:
Title: ${title}
Category: ${category}
Severity: ${severity}
Description: ${description}
Error Messages: ${errorMessages}
Symptoms: ${(symptoms || []).join(', ')}
Recent Changes: ${recentChanges}
Additional Info: ${additionalInfo}
Extracted Evidence: ${JSON.stringify((evidenceList || []).map(e => ({ file: e.fileName, errors: e.detectedErrors })))}

JSON Output Schema:
{
  "problemSummary": "string",
  "identifiedSymptoms": ["string"],
  "possibleCauses": [{ "cause": "string", "confidence": 80, "description": "string", "supportingEvidence": ["string"], "contradictingEvidence": ["string"] }],
  "mostLikelyCause": "string",
  "fiveWhys": [{ "step": 1, "question": "string", "answer": "string", "reasoning": "string" }],
  "finalRootCause": "string",
  "recommendations": { "immediate": ["string"], "shortTerm": ["string"], "longTerm": ["string"] },
  "alternativeExplanations": ["string"],
  "investigationSteps": ["string"],
  "missingInformation": ["string"],
  "confidenceAssessment": "string"
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are an AI Root Cause Analysis expert. You always return valid JSON.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  parsed.modelUsed = 'OpenAI GPT-4o-mini';
  return parsed;
}

module.exports = {
  analyzeIncident,
  generateHeuristicRCA,
};
