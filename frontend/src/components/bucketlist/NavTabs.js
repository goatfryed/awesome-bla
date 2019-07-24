import React, {Fragment, useEffect, useRef, useState} from "react";
import {NavLink, Redirect} from "react-router-dom";
import * as PropTypes from "prop-types";

export function NavTabs({links}) {

    const tabsElement = useRef(null);
    const [url, setUrl] = useState(null);

    function updateUrl() {
        // this in function means calling context
        setUrl(this.to);
    }

    useEffect(
        function () {
            if (tabsElement.current === null) {
                return;
            }

            const instance = window.M.Tabs.init(tabsElement.current);

            return function () {
                instance.destroy();
            }
        },
        [tabsElement.current]
    );

    /* https://stackoverflow.com/a/46531324/10526222 */
    return <Fragment>
        <ul className="tabs" ref={tabsElement}>
            {
                links.map( (link, index) => <li
                    key={index} className="tab col s3">
                    <NavLink onClick={updateUrl} to={link.url} {...link.navLinkProps}>{link.title}</NavLink>
                </li>)
            }
        </ul>
        {url && <Redirect to={url}/>}
    </Fragment>
}



NavTabs.propTypes = {
    links: PropTypes.arrayOf(
        PropTypes.exact({
            url: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            navLinkProps: PropTypes.object,
        })
    ).isRequired,
};