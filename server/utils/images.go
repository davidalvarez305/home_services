package utils

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

func GenerateFileName(fileName string) string {
	return uuid.New().String() + filepath.Ext(fileName)
}

func UploadImageToS3(file io.Reader, fileName string) error {
	ctx := context.TODO()
	var bucketName = os.Getenv("AWS_S3_BUCKET")
	var key = "profile-pictures/" + fileName
	cache := "31536000"

	cfg, err := config.LoadDefaultConfig(ctx)

	if err != nil {
		return err
	}

	params := s3.PutObjectInput{
		Bucket:       &bucketName,
		Key:          &key,
		Body:         file,
		CacheControl: &cache,
	}

	client := s3.NewFromConfig(cfg)

	_, err = client.PutObject(ctx, &params)

	if err != nil {
		return err
	}

	return nil
}

func HandleMultipleImages(form *multipart.Form) ([]string, error) {
	var uploadedImages []string

	for _, fileHeaders := range form.File {
		for _, image := range fileHeaders {

			contents, err := image.Open()

			if err != nil {
				return uploadedImages, err
			}

			var fileName = GenerateFileName(image.Filename)

			err = UploadImageToS3(contents, fileName)

			if err != nil {
				return uploadedImages, err
			}

			uploadedImages = append(uploadedImages, fileName)
		}
	}

	return uploadedImages, nil
}

func GetImageFromURL(url, filepath string) error {

	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("%s", resp.Status)
	}

	_, err = io.Copy(out, resp.Body)

	return err
}
