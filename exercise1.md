In modern python development teams, CI pipelines have similarities to JS/TS ones, but some tools differ:

### 1. Platform:
- `GitHub Actions`
- `GitLab Ci`
- `Jenkins`
- `CircleCi`

### 2. Environment Setup & Dependency Management:
- `pip` + `requirements.txt` (simple but lacks locking mechanisms)
- `Poetry` (Handles dependency resolution, locking, and virtual envs)
- `uv`

### 3. Code Formatting (style police)
- `Black`
- `Ruff` (newcomer. Can replace Black and flake8)

### 4. Linting (static analysis)
- `Flake8` (checks style and syntax errors)
- `Pylint` (very strict, often requires config to silence false positives)
- `Ruff` (as mentioned above)

### 5. Static type Checking
Python is dynamically typed, runtime errors are common. Type checkers use "Type Hints" to catch these errors before execution (TypeScript-like)
- `mypy` (official static type checker for python)
- `Pyright` (Microsoft, faster than mypy) or `Pyre` (meta)

### 6. Testing
Core of CI.

- `pytest` (industry standard)
- `pytest-cov` (plugin, reports what % of code was executed. Teams set a "fail under" threshhold (e.g., fail CI if coverage < 80%>))

### 7. Security Scanninng
Check for vulnerabilities in code and dependencies

- `Safety` or `Dependabot` (GitHub native). (Checks if your installed libraries have known common vulnerabilities and exposures (CVEs))
- `Bandit` (scans code for common security issues (e.g. hardcoded passwords, SQL injection risks))