*** Settings ***
Resource    ../resources/keywords.robot

*** Test Cases ***
Verify Gateway Health
    [Documentation]    Verify that the gateway health endpoint is reachable and returns UP
    Check Gateway Health

Verify API Status
    [Documentation]    Verify that the base API status endpoint is operational
    Create Session    gateway    ${BASE_URL}
    ${resp}=    GET On Session    gateway    /status
    Should Be Equal As Strings    ${resp.status_code}    200
    Should Be Equal As Strings    ${resp.json()}[status]    OK
