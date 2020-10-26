1. Function can be called more than once despite only being called once in the source code
    * This is almost centrainly due to the reload button on the VSCode toolbar both reloading the page and reloading the extesion, effectively calling everything twice. This would not cause a problem in the real world without the debugger creating the bug
2. 