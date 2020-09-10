echo 'install auto-complete script for GIT start'
curl https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash -o ~/.git-completion.bash
echo 'install auto-complete script for GIT end'

echo 'add GIT script to .bash profile start'
echo 'if [ -f ~/.git-completion.bash ]; then' >>~/.bash_profile
echo '  . ~/.git-completion.bash' >>~/.bash_profile
echo 'fi' >>~/.bash_profile
echo 'add GIT script to .bash profile end'

echo 'echo ~/.bash_profile start'
cat ~/.bash_profile
echo 'echo ~/.bash_profile end'
