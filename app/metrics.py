from prometheus_client import Gauge

user_total = Gauge('user_total', 'Total number of user accounts')
user_total_verified = Gauge('user_total_verified', 'Total number of verified user accounts')
