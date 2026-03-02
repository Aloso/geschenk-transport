ALTER TABLE secret_santa 
DROP COLUMN verified;

ALTER TABLE secret_santa
ADD `status` VARCHAR(10) NOT NULL DEFAULT 'pending';
