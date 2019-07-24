import React, {Fragment, useEffect, useRef, useState} from "react";
import {NavLink, Redirect} from "react-router-dom";
import * as PropTypes from "prop-types";

/**
 * react-materialize tabs logic sucks. It does not only style a tab bar a little bit, but is deeply integrated with it's logic
 * of updating the corresponding tab based on some relation of div id and hash link of the 'li.tab > a'. the logic is not
 * really suited for rendering tabs on demand, but forces you to render all subtabs beforehand and simply hides the undesired.
 * also, it's not really suited for integration with react-router.
 * what we want is to set the active tab by current url and simply update the url, when a tab is clicked. but the default handle
 * is completely overridden, unless used with target=_self. also, the tabs component doesn't .updateTabIndicator() through active class.
 * this only works on init of the tabs component.
 *
 * we're now overriding the overridden link handler from materialize to set a redirect to the desired route, while using the navlinks
 * to assess the active link on init.
 * This gives us the fancy pants tab transition effects. useful? who knows.
 *
 * TODO: for some reason, the first transition transitions hard instead of smooth. probably, because materialize asserts the initially active component in some other **** way.
 * TODO: we're probably better of just using a tab component from another framework  - or styling it ourself... just kidding. Maybe https://bulma.io/documentation/components/tabs/
 * as single component?
 *
 * @param links
 * @returns {*}
 * @constructor
 */
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