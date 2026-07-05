package com.hrgenai.hr_genai_backend.dto.response;

import com.hrgenai.hr_genai_backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private User.Role role;
}