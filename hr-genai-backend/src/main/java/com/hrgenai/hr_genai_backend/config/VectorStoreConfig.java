package com.hrgenai.hr_genai_backend.config;

import io.qdrant.client.QdrantClient;
import io.qdrant.client.QdrantGrpcClient;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.transformers.TransformersEmbeddingModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.qdrant.QdrantVectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class VectorStoreConfig {

    @Bean
    public QdrantClient qdrantClient() {
        return new QdrantClient(
                QdrantGrpcClient.newBuilder("localhost", 6334, false)
                        .build()
        );
    }

    @Bean
    public EmbeddingModel embeddingModel() throws Exception {
        TransformersEmbeddingModel model = new TransformersEmbeddingModel();
        model.afterPropertiesSet();
        return model;
    }

   @Bean
@Primary
public VectorStore vectorStore(QdrantClient qdrantClient,
                               EmbeddingModel embeddingModel) {
    return QdrantVectorStore.builder(qdrantClient, embeddingModel)
            .collectionName("hr_genai_vectors")
            .initializeSchema(true)
            .build();
}

    
}