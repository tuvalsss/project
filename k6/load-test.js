import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.1'],    // Less than 10% of requests can fail
  },
};

const BASE_URL = 'http://traefik:80';

export default function () {
  const homeResponse = http.get(`${BASE_URL}/`, {
    headers: {
      'Host': 'dashboard.localhost',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
    },
  });

  check(homeResponse, {
    'home page status is 200': (r) => r.status === 200,
  });

  sleep(1);

  const loginResponse = http.get(`${BASE_URL}/login`, {
    headers: {
      'Host': 'dashboard.localhost',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
    },
  });

  check(loginResponse, {
    'login page status is 200': (r) => r.status === 200,
  });

  sleep(1);
} 