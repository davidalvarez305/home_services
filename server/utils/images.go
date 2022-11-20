package utils

import (
	"context"
	"mime/multipart"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func generateFileName(fileName string) string {
	return strings.Join(strings.Split(fileName, " "), "_")
}

func UploadImageToS3(file *multipart.FileHeader) (string, error) {
	var fileName = generateFileName(file.Filename)
	ctx := context.TODO()
	var bucketName = os.Getenv("AWS_S3_BUCKET")
	var key = "profile-pictures/" + fileName
	cache := "31536000"

	cfg, err := config.LoadDefaultConfig(ctx)

	if err != nil {
		return fileName, err
	}

	contents, err := file.Open()

	if err != nil {
		return fileName, err
	}

	params := s3.PutObjectInput{
		Bucket:       &bucketName,
		Key:          &key,
		Body:         contents,
		CacheControl: &cache,
	}

	client := s3.NewFromConfig(cfg)

	_, err = client.PutObject(ctx, &params)

	if err != nil {
		return fileName, err
	}

	return fileName, nil
}

func HandleMultipleImages(form *multipart.Form) ([]string, error) {
	var uploadedImages []string

	for _, fileHeaders := range form.File {
		for _, image := range fileHeaders {
			uploadedImage, err := UploadImageToS3(image)

			if err != nil {
				return uploadedImages, err
			}

			uploadedImages = append(uploadedImages, uploadedImage)
		}
	}

	return uploadedImages, nil
}
