import cloudinary.uploader

class CloudinaryService:

    @staticmethod
    def upload_image(file):
        result = cloudinary.uploader.upload(file)
        return result.get('secure_url')
    