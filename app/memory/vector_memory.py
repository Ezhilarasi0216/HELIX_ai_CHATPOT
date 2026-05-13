import os
import json
from groq import Groq

def get_client():
    return Groq(api_key=os.getenv("GROQ_API_KEY"))

async def semantic_search(query: str, items: list, top_k: int = 3):
    """
    A semantic search proxy using LLM to rank relevance.
    In a production app, this would use embeddings and a vector DB like Pinecone/FAISS.
    """
    if not items: return []
    
    prompt = f"""Search through these items:
    {items}
    
    Top {top_k} most relevant items to the query: "{query}"
    Return ONLY a JSON list of the most relevant items.
    """
    
    try:
        completion = get_client().chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)
        return list(data.values())[0][:top_k] if isinstance(list(data.values())[0], list) else []
    except:
        return items[:top_k]
