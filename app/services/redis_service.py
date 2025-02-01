import redis
from app.tools.teklogger import log_info, log_debug, log_error


class RedisService:
    connection = None

    @staticmethod
    def connect(host='localhost', port=6379, db=0, password=None):
        """
        Create a connection to a Redis server.
        """
        try:
            RedisService.connection = redis.Redis(
                host=host,
                port=port,
                db=db,
                password=password,
                decode_responses=True
            )
        except redis.ConnectionError as e:
            log_error(
                f"Failed to connect to Redis server at {host}:{port}: {e}")
            raise

    @staticmethod
    def disconnect():
        """
        Close the connection to the Redis server.
        """
        if RedisService.connection:
            RedisService.connection.close()
            RedisService.connection = None
            log_info("Disconnected from Redis")

    @staticmethod
    def ensure_connection():
        """
        Ensure that the Redis connection is active.
        """
        try:
            if not RedisService.connection or not RedisService.connection.ping():
                log_info("Reconnecting to Redis...")
                RedisService.connect()
        except redis.ConnectionError as e:
            log_error(
                f"Failed to reconnect to Redis server: {e}")
            raise

    @staticmethod
    def set(key, value, ex=None):
        """
        Set a value in Redis.

        :param key: Redis key
        :param value: Value to set
        :param ex: Expiration time in seconds (optional)
        """
        RedisService.ensure_connection()
        try:
            RedisService.connection.set(key, value, ex=ex)
        except Exception as e:
            log_error(f"Error setting key '{key}': {e}")
            raise

    @staticmethod
    def get(key):
        """
        Get a value from Redis.

        :param key: Redis key
        :return: Value associated with the key
        """
        RedisService.ensure_connection()
        try:
            value = RedisService.connection.get(key)
            return value
        except Exception as e:
            log_error(f"Error getting key '{key}': {e}")
            raise

    @staticmethod
    def delete(key):
        """
        Delete a key from Redis.

        :param key: Redis key
        """
        RedisService.ensure_connection()
        try:
            RedisService.connection.delete(key)
            log_debug(f"Key '{key}' deleted successfully.")
        except Exception as e:
            log_error(f"Error deleting key '{key}': {e}")
            raise
