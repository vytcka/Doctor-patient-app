Data base setup for us to wrok, since we are switching to a different system

Download the installer from postgresql.org/download/windows

 * Run the installer

 * Keep the port as 5432
 * Finish the install you don't need Stack Builder at the end, you can skip it


Step 2 Create the Database & User
remember to set up psql as a enviornmental variable
psql -U postgres -c "CREATE USER admin WITH PASSWORD 'password';"
psql -U postgres -c "CREATE DATABASE treatme OWNER admin;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE treatme TO admin;"

It will ask for your postgres password (the one you set during install)


psql -U admin -d treatme 
ALTER TABLE "user" ADD COLUMN points INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE "user" ADD COLUMN badges JSON DEFAULT '[]' NOT NULL;

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
