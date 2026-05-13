#!/usr/bin/env python3
"""
Comprehensive Test Suite for NativeTalk Test Accounts
Tests all aspects of account functionality
"""

import requests
import json
import time
from datetime import datetime

class ComprehensiveAccountTester:
    """Complete testing suite for test accounts"""
    
    def __init__(self, backend_url="http://127.0.0.1:8000"):
        self.backend_url = backend_url
        self.password = "Password123"
        self.results = {
            "test_time": datetime.now().isoformat(),
            "backend_url": backend_url,
            "tests": {}
        }
        
    def test_backend_health(self):
        """Test 1: Backend is running and healthy"""
        test_name = "Backend Health Check"
        try:
            response = requests.get(
                f"{self.backend_url}/api/v1/health",
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                self.results["tests"][test_name] = {
                    "status": "PASS",
                    "response_code": 200,
                    "data": data
                }
                return True
            else:
                self.results["tests"][test_name] = {
                    "status": "FAIL",
                    "response_code": response.status_code
                }
                return False
        except Exception as e:
            self.results["tests"][test_name] = {
                "status": "FAIL",
                "error": str(e)
            }
            return False
    
    def test_registration(self):
        """Test 2: Registration endpoint works"""
        test_name = "Registration Endpoint"
        timestamp = int(time.time())
        test_email = f"registration_test_{timestamp}@example.com"
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/v1/auth/register",
                json={
                    "email": test_email,
                    "password": "TempPassword123",
                    "full_name": "Registration Test User"
                },
                timeout=10
            )
            
            if response.status_code == 201:
                data = response.json()
                self.results["tests"][test_name] = {
                    "status": "PASS",
                    "response_code": 201,
                    "has_access_token": "access_token" in data,
                    "has_refresh_token": "refresh_token" in data,
                    "user_email": data.get("user", {}).get("email")
                }
                return True
            else:
                self.results["tests"][test_name] = {
                    "status": "FAIL",
                    "response_code": response.status_code,
                    "error": response.text[:100]
                }
                return False
        except Exception as e:
            self.results["tests"][test_name] = {
                "status": "FAIL",
                "error": str(e)
            }
            return False
    
    def test_student_logins(self):
        """Test 3: All student accounts can login"""
        test_name = "Student Logins"
        students = [
            "alice@example.com",
            "bob@example.com",
            "carlos@example.com",
            "diana@example.com",
            "emma@example.com"
        ]
        
        results = {}
        all_passed = True
        
        for email in students:
            try:
                response = requests.post(
                    f"{self.backend_url}/api/v1/auth/login",
                    json={"email": email, "password": self.password},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    results[email] = {
                        "status": "PASS",
                        "role": data.get("user", {}).get("role"),
                        "is_active": data.get("user", {}).get("is_active"),
                        "has_tokens": "access_token" in data
                    }
                else:
                    results[email] = {
                        "status": "FAIL",
                        "response_code": response.status_code
                    }
                    all_passed = False
            except Exception as e:
                results[email] = {
                    "status": "FAIL",
                    "error": str(e)
                }
                all_passed = False
        
        self.results["tests"][test_name] = {
            "status": "PASS" if all_passed else "FAIL",
            "passed_count": sum(1 for r in results.values() if r["status"] == "PASS"),
            "total_count": len(students),
            "details": results
        }
        return all_passed
    
    def test_tutor_logins(self):
        """Test 4: All tutor accounts can login"""
        test_name = "Tutor Logins"
        tutors = [
            "marie@example.com",
            "hans@example.com",
            "juan@example.com",
            "yuki@example.com",
            "sophia@example.com"
        ]
        
        results = {}
        all_passed = True
        
        for email in tutors:
            try:
                response = requests.post(
                    f"{self.backend_url}/api/v1/auth/login",
                    json={"email": email, "password": self.password},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    results[email] = {
                        "status": "PASS",
                        "role": data.get("user", {}).get("role"),
                        "is_active": data.get("user", {}).get("is_active"),
                        "has_tokens": "access_token" in data
                    }
                else:
                    results[email] = {
                        "status": "FAIL",
                        "response_code": response.status_code
                    }
                    all_passed = False
            except Exception as e:
                results[email] = {
                    "status": "FAIL",
                    "error": str(e)
                }
                all_passed = False
        
        self.results["tests"][test_name] = {
            "status": "PASS" if all_passed else "FAIL",
            "passed_count": sum(1 for r in results.values() if r["status"] == "PASS"),
            "total_count": len(tutors),
            "details": results
        }
        return all_passed
    
    def test_token_structure(self):
        """Test 5: JWT tokens have proper structure"""
        test_name = "JWT Token Structure"
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/v1/auth/login",
                json={"email": "alice@example.com", "password": self.password},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                access_token = data.get("access_token")
                refresh_token = data.get("refresh_token")
                
                # Basic JWT structure check (header.payload.signature)
                access_parts = access_token.split(".") if access_token else []
                refresh_parts = refresh_token.split(".") if refresh_token else []
                
                valid_structure = (len(access_parts) == 3 and len(refresh_parts) == 3)
                
                self.results["tests"][test_name] = {
                    "status": "PASS" if valid_structure else "FAIL",
                    "access_token_parts": len(access_parts),
                    "refresh_token_parts": len(refresh_parts),
                    "token_type": data.get("token_type")
                }
                return valid_structure
            else:
                self.results["tests"][test_name] = {
                    "status": "FAIL",
                    "response_code": response.status_code
                }
                return False
        except Exception as e:
            self.results["tests"][test_name] = {
                "status": "FAIL",
                "error": str(e)
            }
            return False
    
    def test_password_validation(self):
        """Test 6: Password validation works"""
        test_name = "Password Validation"
        
        try:
            # Try with wrong password
            response = requests.post(
                f"{self.backend_url}/api/v1/auth/login",
                json={"email": "alice@example.com", "password": "WrongPassword123"},
                timeout=10
            )
            
            # Should fail with 401 or 400
            wrong_password_fails = response.status_code in [401, 400]
            
            # Try with correct password
            response = requests.post(
                f"{self.backend_url}/api/v1/auth/login",
                json={"email": "alice@example.com", "password": self.password},
                timeout=10
            )
            
            correct_password_works = response.status_code == 200
            
            self.results["tests"][test_name] = {
                "status": "PASS" if (wrong_password_fails and correct_password_works) else "FAIL",
                "wrong_password_rejected": wrong_password_fails,
                "correct_password_accepted": correct_password_works
            }
            return wrong_password_fails and correct_password_works
        except Exception as e:
            self.results["tests"][test_name] = {
                "status": "FAIL",
                "error": str(e)
            }
            return False
    
    def test_account_data_completeness(self):
        """Test 7: All account data fields are present"""
        test_name = "Account Data Completeness"
        
        required_fields = ["id", "email", "full_name", "role", "is_active"]
        
        try:
            response = requests.post(
                f"{self.backend_url}/api/v1/auth/login",
                json={"email": "alice@example.com", "password": self.password},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                user = data.get("user", {})
                
                missing_fields = [f for f in required_fields if f not in user or user[f] is None]
                
                self.results["tests"][test_name] = {
                    "status": "PASS" if not missing_fields else "FAIL",
                    "required_fields": required_fields,
                    "missing_fields": missing_fields,
                    "user_data": {k: v for k, v in user.items() if k in required_fields}
                }
                return not missing_fields
            else:
                self.results["tests"][test_name] = {
                    "status": "FAIL",
                    "response_code": response.status_code
                }
                return False
        except Exception as e:
            self.results["tests"][test_name] = {
                "status": "FAIL",
                "error": str(e)
            }
            return False
    
    def run_all_tests(self):
        """Run all tests and return summary"""
        print("\n" + "="*70)
        print("COMPREHENSIVE TEST SUITE FOR NATIVETALK ACCOUNTS")
        print("="*70 + "\n")
        
        tests = [
            ("Backend Health Check", self.test_backend_health),
            ("Registration Endpoint", self.test_registration),
            ("Student Logins", self.test_student_logins),
            ("Tutor Logins", self.test_tutor_logins),
            ("JWT Token Structure", self.test_token_structure),
            ("Password Validation", self.test_password_validation),
            ("Account Data Completeness", self.test_account_data_completeness)
        ]
        
        passed = 0
        failed = 0
        
        for test_label, test_func in tests:
            result = test_func()
            status = "PASS" if result else "FAIL"
            symbol = "[OK]" if result else "[FAIL]"
            print(f"{symbol} {test_label:40} {status}")
            
            if result:
                passed += 1
            else:
                failed += 1
        
        print("\n" + "="*70)
        print(f"RESULTS: {passed} passed, {failed} failed out of {passed + failed} tests")
        print("="*70 + "\n")
        
        return self.results
    
    def get_results_json(self):
        """Get results as JSON"""
        return json.dumps(self.results, indent=2)
    
    def print_detailed_results(self):
        """Print detailed test results"""
        print("\nDETAILED TEST RESULTS:")
        print("="*70)
        print(json.dumps(self.results, indent=2))


if __name__ == "__main__":
    import sys
    
    backend_url = "http://127.0.0.1:8000"
    if len(sys.argv) > 1:
        backend_url = sys.argv[1]
    
    tester = ComprehensiveAccountTester(backend_url)
    results = tester.run_all_tests()
    
    if "--detailed" in sys.argv:
        tester.print_detailed_results()
    
    # Print summary
    all_passed = all(
        test_result.get("status") == "PASS" 
        for test_result in results["tests"].values()
    )
    
    if all_passed:
        print("\n*** ALL TESTS PASSED - SYSTEM READY FOR TESTING ***\n")
        sys.exit(0)
    else:
        print("\n*** SOME TESTS FAILED - REVIEW RESULTS ABOVE ***\n")
        sys.exit(1)
