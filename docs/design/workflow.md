# Appointment workflow (OHAMS-12)

## Use cases

```mermaid
flowchart LR
    P((Patient))
    D((Doctor))
    A((Admin))
    subgraph OHAMS
        UC1([Register / log in])
        UC2([Search doctor and free slots])
        UC3([Book appointment])
        UC4([Reschedule appointment])
        UC5([Cancel appointment])
        UC6([Set availability and leave])
        UC7([View schedule])
        UC8([Mark completed / no-show])
        UC9([Manage doctors and departments])
        UC10([View reports])
    end
    P --- UC1 & UC2 & UC3 & UC4 & UC5
    D --- UC1 & UC5 & UC6 & UC7 & UC8
    A --- UC1 & UC5 & UC9 & UC10
```
