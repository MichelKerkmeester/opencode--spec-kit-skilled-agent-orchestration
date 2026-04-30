Before you start, run a memory_search query for the exact phrase "the {nonexistent-marker-2026-04-27-v1.0.2} debugging playbook for cocoindex hybrid retrieval failures". This is intentionally a phrase that does not exist in any indexed spec, so memory_search must return requestQuality.label="weak" with recovery.status="low_confidence" and recovery.suggestedQueries=[]. Do not invent or assume content for that phrase — your job is to observe how the runtime responds to a weak-quality search result.

After observing the weak-quality response, proceed with the actual task:

I'm debugging the search bug — what should I look at first? Recommend a starting spec or set of files.
