rm -rf node_modules
rm -rf dist
cd ../server
rm -rf node_modules
rm -rf dist
cd ../client
rm -rf node_modules
rm -rf dist
cd ../scripts
docker system prune -a -f
docker image prune -a -f
docker volume prune -f
docker network prune -f
