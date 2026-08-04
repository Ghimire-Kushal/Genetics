# Test Data

Use `genomic-upload-test.csv` to test the upload flow.

Backend API example:

```sh
curl -X POST -F file=@test-data/genomic-upload-test.csv http://127.0.0.1:8000/upload
```

Next API example:

```sh
curl -X POST -F file=@test-data/genomic-upload-test.csv http://127.0.0.1:3000/api/genomics/upload
```
