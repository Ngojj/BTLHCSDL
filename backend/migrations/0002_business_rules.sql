-- A student may have at most 3 courses in progress at the same time.
-- Enforced in the database so every write path (payment webhook, free enrollment, SQL console) obeys it.
-- The message text is matched by join.service.createJoin.
DELIMITER $$
CREATE TRIGGER `trg_join_limit_active_courses`
BEFORE INSERT ON `join`
FOR EACH ROW
BEGIN
	DECLARE active_courses INT;
	SELECT COUNT(*) INTO active_courses FROM `join` WHERE `studentId` = NEW.`studentId` AND `progress` < 100;
	IF active_courses >= 3 THEN
		SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Bạn không thể đăng ký thêm khi đang có 3 khóa đang học';
	END IF;
END $$
DELIMITER ;
