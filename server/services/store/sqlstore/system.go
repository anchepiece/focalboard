package sqlstore

import (
	sq "github.com/Masterminds/squirrel"
)

func (s *SQLStore) getSystemSettings(db sq.BaseRunner) (map[string]string, error) {
	query := s.getQueryBuilder(db).Select("*").From(s.tablePrefix + "system_settings")

	rows, err := query.Query()
	if err != nil {
		return nil, err
	}
	defer s.CloseRows(rows)

	results := map[string]string{}

	for rows.Next() {
		var id string
		var value string

		err := rows.Scan(&id, &value)
		if err != nil {
			return nil, err
		}

		results[id] = value
	}

	return results, nil
}

func (s *SQLStore) setSystemSetting(db sq.BaseRunner, id, value string) error {
	query := s.getQueryBuilder(db).Insert(s.tablePrefix+"system_settings").Columns("id", "value").Values(id, value)

	if s.dbType == mysqlDBType {
		query = query.Suffix("ON DUPLICATE KEY UPDATE value = ?", value)
	} else {
		query = query.Suffix("ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value")
	}

	_, err := query.Exec()
	if err != nil {
		return err
	}

	return nil
}
