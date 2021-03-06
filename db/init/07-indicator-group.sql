/*Connect to database*/
\connect mobydq



/*Create table indicator group*/
CREATE TABLE base.indicator_group (
    id SERIAL PRIMARY KEY
  , name TEXT NOT NULL UNIQUE
  , created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  , created_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.user(id)
  , updated_by_id INTEGER DEFAULT base.get_current_user_id() REFERENCES base.user(id)
  , user_group_id INTEGER DEFAULT 0 REFERENCES base.user_group(id)
);

COMMENT ON TABLE base.indicator_group IS
'Indicator groups define collections of indicators to be computed in the same batch.';

CREATE TRIGGER indicator_group_update_updated_date BEFORE UPDATE
ON base.indicator_group FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_date();

CREATE TRIGGER indicator_group_update_updated_by_id BEFORE UPDATE
ON base.indicator_group FOR EACH ROW EXECUTE PROCEDURE
base.update_updated_by_id();

CREATE TRIGGER indicator_group_delete_indicator BEFORE DELETE
ON base.indicator_group FOR EACH ROW EXECUTE PROCEDURE
base.delete_children('indicator', 'indicator_group_id');

CREATE TRIGGER indicator_group_delete_batch BEFORE DELETE
ON base.indicator_group FOR EACH ROW EXECUTE PROCEDURE
base.delete_children('batch', 'indicator_group_id');
