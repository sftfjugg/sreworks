ALTER TABLE `failure_record` DROP FOREIGN KEY def_ibfk_7;
ALTER TABLE `failure_record` DROP FOREIGN KEY incident_ibfk_2;
ALTER TABLE `incident_type` ADD UNIQUE `key_label`(label);