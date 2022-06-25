module.exports = {
  '*.{ts,json,md}': ['prettier --write', 'git add'],
  '*.ts': ['eslint --fix', 'eslint'],
  '*.json': ['jsonlint -c', 'git add'],
  '*.{yaml,yml}': ['yamllint', 'git add'],
};
