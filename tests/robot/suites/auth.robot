*** Settings ***
Resource    ../resources/keywords.robot

*** Test Cases ***
Verify Profile Access Without Token
    [Documentation]    Accessing profile without a token should fail
    Create Session    gateway    ${BASE_URL}
    ${resp}=    GET On Session    gateway    /auth/profile    expected_status=401
    Should Be Equal As Strings    ${resp.json()}[message]    Missing or invalid authorization header

Verify Profile Access With Invalid Token
    [Documentation]    Accessing profile with an invalid token should fail
    ${headers}=    Create Dictionary    Authorization=Bearer invalid-token
    Create Session    gateway    ${BASE_URL}    headers=${headers}
    ${resp}=    GET On Session    gateway    /auth/profile    expected_status=401
    Should Be Equal As Strings    ${resp.json()}[message]    Invalid token
