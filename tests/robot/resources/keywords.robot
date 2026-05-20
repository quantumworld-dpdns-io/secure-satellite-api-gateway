*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource   variables.robot

*** Keywords ***
Create Session and Auth Header
    [Arguments]    ${token}
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}    Content-Type=application/json
    Create Session    gateway    ${BASE_URL}    headers=${headers}
    RETURN    ${headers}

Check Gateway Health
    Create Session    health    ${HEALTH_URL}
    ${resp}=    GET On Session    health    /
    Should Be Equal As Strings    ${resp.status_code}    200
    Dictionary Should Contain Key    ${resp.json()}    status
    Should Be Equal As Strings    ${resp.json()}[status]    UP
