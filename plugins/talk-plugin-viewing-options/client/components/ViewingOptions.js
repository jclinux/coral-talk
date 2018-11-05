import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './ViewingOptions.css';
import { t } from 'plugin-api/beta/client/services';
import { Icon } from 'plugin-api/beta/client/components/ui';
import { ClickOutside } from 'plugin-api/beta/client/components';
import Menu from './Menu';

class ViewingOptions extends React.Component {
  toggleOpen = () => {
    const { open, openMenu, closeMenu } = this.props;
    if (!open) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  handleClickOutside = () => {
    const { open, closeMenu } = this.props;
    if (open) {
      closeMenu();
    }
  };

  render() {
    const { open, slotPassthrough } = this.props;
    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div className={cn([styles.root, 'talk-plugin-viewing-options'])}>
          <div>
            <button className={styles.button} onClick={this.toggleOpen}>
              <Icon className={styles.icon} name="filter_list" />
              <span className={styles.label}>
                {t('talk-plugin-viewing-options.viewing_options')}
              </span>
              {open ? (
                <Icon name="arrow_drop_up" className={styles.arrowIcon} />
              ) : (
                <Icon name="arrow_drop_down" className={styles.arrowIcon} />
              )}
            </button>
          </div>
          {open && <Menu slotPassthrough={slotPassthrough} />}
        </div>
      </ClickOutside>
    );
  }
}

ViewingOptions.propTypes = {
  slotPassthrough: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
};

export default ViewingOptions;
