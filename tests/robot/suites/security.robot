*** Settings ***
Resource    ../resources/keywords.robot

*** Test Cases ***
(A01) Broken Access Control - Unauthorized Admin Access
    [Documentation]    Accessing admin endpoint without ADMIN role should fail
    ${headers}=    Create Dictionary    Authorization=Bearer regular-user-token
    Create Session    gateway    ${BASE_URL}    headers=${headers}
    ${resp}=    GET On Session    gateway    /auth/admin-only    expected_status=403
    Should Be Equal As Strings    ${resp.json()}[message]    You do not have permission to perform this action

(A03) Injection - SQL Injection Payload in Headers
    [Documentation]    Testing SQL Injection payload in X-Request-ID header
    ${headers}=    Create Dictionary    X-Request-ID=' OR 1=1 --
    Create Session    gateway    ${BASE_URL}    headers=${headers}
    ${resp}=    GET On Session    gateway    /status
    Should Be Equal As Strings    ${resp.status_code}    200

(A07) Identification and Auth Failures - Invalid JWT Signature
    [Documentation]    Accessing with a token having an invalid signature
    ${headers}=    Create Dictionary    Authorization=Bearer header.payload.invalid-sig
    Create Session    gateway    ${BASE_URL}    headers=${headers}
    ${resp}=    GET On Session    gateway    /auth/profile    expected_status=401
    Should Be Equal As Strings    ${resp.json()}[message]    Invalid token

(A10) SSRF - Proxy Path Traversal
    [Documentation]    Testing SSRF through path traversal in proxy routes
    Create Session    gateway    ${BASE_URL}
    ${resp}=    GET On Session    gateway    /telemetry/../../etc/passwd    expected_status=400
    # Should be blocked by normalization or schema validation
