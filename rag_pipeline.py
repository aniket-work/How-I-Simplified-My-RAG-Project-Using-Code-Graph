from retriever import retrieve_documents
from generator import generate_response

def process_query(query, documents):
    """Process a query using RAG pipeline."""
    retrieved_docs = retrieve_documents(query, documents)
    return generate_response(retrieved_docs, query)

def redundant_pipeline(query, documents):
    """Redundant pipeline for processing queries."""
    return process_query(query, documents)

if __name__ == "__main__":
    docs = ["This is a sample document.", "Another example document.", "Query response example."]
    query = "example"
    response = process_query(query, docs)
    print(response)
