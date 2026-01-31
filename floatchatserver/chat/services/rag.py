from vectorstore.store import retrieve

def get_rag_context(user_query):
    docs = retrieve(user_query, k=3)
    if not docs:
        return ""

    context = "\n".join(
        f"- {d['text']}" for d in docs
    )
    return context
