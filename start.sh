#!/bin/zsh

SESSIONNAME="stream-devel"

# &> is to direct stdout and stderr to what ever file
# /dev/null is to throw a way
tmux has-session -t $SESSIONNAME &> /dev/null 

# $? return value of the last executed command wich is the tmux has-session one 

if [ $? != 0 ]
    then
        tmux new-session -s $SESSIONNAME -n main -d  
fi

tmux attach -t $SESSIONNAME
