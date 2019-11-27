#!/bin/bash
echo "Deploying..." && \
git add . && git commit -m "$1" && git push && pm2 deploy production && \
echo "Done!"
