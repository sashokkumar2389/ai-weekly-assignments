# MongoDB Atlas Search BM25 Configuration

This guide explains how to set up MongoDB Atlas Search with BM25 for the Resume Search application.

## Prerequisites

- MongoDB Atlas cluster running version 4.2 or higher
- Access to MongoDB Atlas console
- Collection: `db_resumes.resumes`

## Step 1: Create the Atlas Search Index

### Using MongoDB Atlas Console

1. Go to your MongoDB Atlas cluster
2. Select **Search** from the left sidebar
3. Click **Create Search Index**
4. Select **JSON Editor** (optional - you can also use the visual editor)
5. Choose the collection: `db_resumes.resumes`
6. Paste the following JSON configuration:

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "text": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "skills": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "role": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "experienceSummary": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "name": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "company": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "location": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "email": {
        "type": "string",
        "analyzer": "lucene.standard"
      }
    }
  }
}
```

7. Click **Create Index**
8. Wait for the index to build (status will change from "Building" to "Active")

## Step 2: Name the Index

If not already named:
- Index name should be: `bm25_search_index`
- This matches the `MONGODB_BM25_INDEX` environment variable in `.env`

## Step 3: Verify Index Creation

Once the index is Active, the `/v1/search/bm25` endpoint will automatically use it.

Check status with:
```bash
curl http://localhost:3000/v1/health/diagnostics
```

Should show the BM25 index in the indexes list.

## BM25 Search Query Example

The endpoint now uses the Atlas Search BM25 algorithm automatically:

```bash
curl -X POST http://localhost:3000/v1/search/bm25 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "java spring boot",
    "topK": 20,
    "filters": {}
  }'
```

## Advanced Configuration

### Custom Analyzer

For better handling of resume text, you can use a custom analyzer:

```json
{
  "analyzers": [
    {
      "name": "resume_analyzer",
      "charFilters": [],
      "tokenizer": {
        "type": "standard"
      },
      "tokenFilters": [
        {
          "type": "lowercase"
        },
        {
          "type": "stop",
          "stopwords": [
            "a", "an", "and", "are", "as", "at", "be", "by", "for", "if",
            "in", "into", "is", "it", "no", "not", "of", "on", "or", "such",
            "that", "the", "their", "then", "there", "these", "they", "this",
            "to", "was", "will", "with"
          ]
        }
      ]
    }
  ],
  "mappings": {
    "dynamic": false,
    "fields": {
      "text": {
        "type": "string",
        "analyzer": "resume_analyzer"
      },
      "skills": {
        "type": "string",
        "analyzer": "resume_analyzer"
      },
      "role": {
        "type": "string",
        "analyzer": "resume_analyzer"
      },
      "experienceSummary": {
        "type": "string",
        "analyzer": "resume_analyzer"
      }
    }
  }
}
```

## Troubleshooting

### Index not found error
- Ensure the index name in `.env` matches the Atlas Search index name
- Check that the index is in "Active" status

### No results returned
- Verify documents have been inserted into the collection
- Check that fields exist in documents (text, skills, role, experienceSummary)
- Use `/v1/health/diagnostics` to verify collection contains data

### Slow searches
- Ensure index is fully built (check Atlas console)
- Try with shorter queries (complex queries may be slower)
- Check MongoDB cluster performance metrics

## Index Sizing Notes

- Text fields should contain meaningful content
- Skills as comma-separated or JSON array
- Role should be job title
- experienceSummary should be a text description

## References

- [MongoDB Atlas Search Documentation](https://docs.atlas.mongodb.com/atlas-search/)
- [BM25 Algorithm](https://docs.atlas.mongodb.com/atlas-search/text-operator/)
- [Creating Search Indexes](https://docs.atlas.mongodb.com/atlas-search/create-index/)
