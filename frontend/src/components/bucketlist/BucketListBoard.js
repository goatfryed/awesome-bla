import React, {PureComponent, useCallback, useMemo} from 'react';
import {Route, Switch} from "react-router";
import {Link, Redirect} from "react-router-dom";
import {backendFetch} from "../../api";
import {NavTabs} from "./NavTabs";
import Authentication from "../../authentication/Authentication";
import PropTypes from "prop-types";
import {Button} from "react-materialize"

const publicListsLink = {
    url: "/home/public",
    title: "All",
};
const personalListsLink = {
    url: "/home/personal",
    title: "Personal",
};
const createListsLink = {
    url: "/newlist",
    title: "New List",
};

export function BucketListBoard({match}) {

    let authenticated = Authentication.isAuthenticated();
    let links = useMemo(
        () => (
            authenticated ? [
                publicListsLink,
                personalListsLink,
                createListsLink,
            ] : [
                publicListsLink,
            ]

        ),
        [authenticated]
    );

    return (
        <div>
            <h5>Bucket Lists</h5>
            <NavTabs links={links}/>
            <Switch>
                <Route path={match.path + "/public"} exact strict
                       component={BucketListView}
                />
                {
                    // key forces mount of a new bucket list view. didn't want to rewrite the component (yet)
                    Authentication.isAuthenticated() &&
                    <Route path={match.path + "/personal"} exact strict
                           render={() => <BucketListView key="personal"
                                                         owner={{userName: Authentication.getUser().sub}}/>}
                    />
                }
                {
                    // key forces mount of a new bucket list view. didn't want to rewrite the component (yet)
                    <Route path={match.path + "/user/:username"} exact strict
                           render={(props) => <BucketListView key="personal" specUser={props.match.params.username}/>}
                    />
                }
                <Redirect to={match.path + "/public"}/>
            </Switch>
        </div>
    );
}

export class BucketListView extends PureComponent {

    state = {};

    constructor(props) {
        super(props);
        this.state = {
            bucketLists: [],
            lastingElements: null,
            loadedPages: 0
        };
        this.loadMore = this.loadMore.bind(this);

    }

    loadMore() {
        let query = new URLSearchParams({
            page: this.state.loadedPages,
        });
        if (this.props.owner) {
            query.append("userName", this.props.owner.userName);
        }
        if (this.props.specUser) {
            query.append("userName", this.props.specUser);
        }
        backendFetch.get('/bucketlists/?' + query.toString()).then(response => {
            if (response.content.length > 0) {
                this.setState({loadedPages: this.state.loadedPages + 1});
            }
            let nextBucketLists = this.props.filter ? response.content.filter(this.props.filter) : response.content;
            this.setState({
                lastingElements: response.lastingElements,
                bucketLists: [...this.state.bucketLists, ...nextBucketLists]
            });
        });
    }

    componentDidMount() {
        this.loadMore = this.loadMore.bind(this);
        this.setState({loadedPages: 0});
        this.loadMore();
    }

    render() {
        const moreSides = () => {
            return this.state.lastingElements == null ? '' : this.state.lastingElements <= 0 ?
                <div>Kine Weiteren Listen verfügbar</div> :
                <div>{this.state.lastingElements} weiter Listen <Button type="submit"
                                                                        onClick={this.loadMore.bind(this)}>Laden</Button>
                </div>
        };

        return <>
            <Lists bucketLists={this.state.bucketLists} onListInteraction={this.props.onListInteraction}/>
            {moreSides()}
        </>
    }
}

BucketListView.propTypes = {
    owner: PropTypes.object,
    specUser: PropTypes.string,
};

function BucketListIcon({bucketList}) {
    let iconDescriptor;
    if (bucketList.private) {
        iconDescriptor = {
            icon: "lock_outline",
            class: "black",
            title: "This list is private",
        };
    } else {
        iconDescriptor = {
            icon: "playlist_add_check",
            class: "green",
            title: "This list is public",
        }
    }
    return <i title={iconDescriptor.title}
              className={"material-icons circle " + iconDescriptor.class}>{iconDescriptor.icon}</i>;
}

// use onInteraction to override behaviour of all links to the bucket lists
// is used in importer to trigger an import action instead of routing
function BucketListEntry({bucketList, onInteraction}) {

    let onMainInteraction = useCallback(
        e => {
            if (!onInteraction) return;
            e.stopPropagation();
            e.preventDefault();

            onInteraction(bucketList);
        },
        [bucketList, onInteraction]
    );


    return <li className="collection-item avatar" style={{minHeight: "initial"}}>
        <Link to={"/bucketlist/" + bucketList.id} onClick={onMainInteraction}
        ><BucketListIcon bucketList={bucketList}/></Link>
        <div className="row" style={{marginBottom: "initial"}}>
            <div className="col">
                <span className="title"><Link to={"/bucketlist/" + bucketList.id}
                                              onClick={onMainInteraction}>{bucketList.title}</Link></span>
                <p>{
                    bucketList.ownList ? <span>your List</span>
                        : <span>{bucketList.privateList ? "shared by" : "by"} {bucketList.owner.userName}</span>
                }</p>
            </div>
            <div className="col">
                <span>{bucketList.description}</span>
            </div>
        </div>
        <Link to={"/bucketlist/" + bucketList.id}
              onClick={onMainInteraction}
              className="secondary-content"><i
            className="material-icons">send</i></Link>
    </li>;
}

const Lists = ({bucketLists, onListInteraction}) => {
    return <ul className="collection lighten-1">
        {
            bucketLists.map(bucketList => <BucketListEntry key={bucketList.id} bucketList={bucketList}
                                                           onInteraction={onListInteraction}/>)
        }
    </ul>
};
