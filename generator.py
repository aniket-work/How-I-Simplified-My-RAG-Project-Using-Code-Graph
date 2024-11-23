def generate_response(retrieved_docs, query):
    """Generate a response based on retrieved documents."""
    if not retrieved_docs:
        return f"Sorry, I found nothing relevant for '{query}'."
    return f"Here's a response based on your query: {retrieved_docs[0]}"

def unused_function():
    """An unused function."""
    pass
