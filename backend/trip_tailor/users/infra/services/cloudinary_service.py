import cloudinary.uploader
from core.exceptions import ImageUploadError
import logging

logger = logging.Logger(__name__)

class CloudinaryService:

    @staticmethod
    def upload_image(file):
        try:
            result = cloudinary.uploader.upload(file)
            return result.get('secure_url')
        
        except Exception as e:
            logger.exception("Cloudinary image upload failed")
            raise ImageUploadError("Image upload failed") from e

    