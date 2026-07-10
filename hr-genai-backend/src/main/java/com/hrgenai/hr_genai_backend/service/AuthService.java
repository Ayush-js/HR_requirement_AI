package com.hrgenai.hr_genai_backend.service;

import java.util.List;
import java.util.Map;

import com.hrgenai.hr_genai_backend.dto.request.LoginRequest;
import com.hrgenai.hr_genai_backend.dto.request.RegisterRequest;
import com.hrgenai.hr_genai_backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    List<Map<String, Object>> getAllUsers();
    Map<String, Object> getStats();

}