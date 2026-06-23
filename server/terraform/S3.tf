terraform{
    backend "s3"{
        bucket = "quickshow-bucket-server"
        key = "server/terraform/terraform.tfstate"
        region = "us-east-1"
        dynamodb_table = "terraform-locks"
        encrypt        = true

    }
}