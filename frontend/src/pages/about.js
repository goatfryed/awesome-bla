import React from "react";

export function About() {
    return <div className="valign-wrapper" style={{minHeight: "70vh"}}>
        <div className="row">
            <div className="col offset-l3 l6">
                <h2 className="title center-align">Awesome Bucket List!</h2>
                <div>
                    This is an awesome bucket list application where you can make lists of things you want to do before
                    you die or before you
                    go on your next alumni meetup or before you forget it or before your husband and your girlfriend
                    meet each other.
                </div>
                <br/>
                <div>
                    Awesome Bucket List was made as an lecture project by students of <a
                    href="https://www.uni-kassel.de/uni/">university kassel</a> for web engineering SS2019.
                    See the <a href="https://github.com/micromata/webengineering-2019">lecture project</a> for more about the lecture.
                </div>
                <br/>
                <div>
                    <h5><a href="https://xkcd.com/1998/">Regarding privacy</a></h5>
                    All registered users' full names and user names are public.
                    We don't retrieve other user information. We don't do anything with it.
                </div>
                <br/>
                <div>
                    <h5>Code of conduct</h5>
                    <ol className="browser-default">
                        <li>Please don't be an asshole.</li>
                        <li>Please don't take this side serious</li>
                        <li>
                            Don't upload links that you shouldn't, insult people, make public kill lists, or anything.
                            You know it. The usual stuff. If in doubt, refer to 1.
                        </li>
                        <li>If you happen to notice problematic content, please file a github issue and we'll delete it
                            <ul className="browser-default">
                                <li>We'll probably just drop the database</li>
                                <li>In all honesty, we'll probably take the page down because I can't see us putting
                                    effort into community management
                                </li>
                                <li>Unlike features. I can see us putting some effort in some new shitty features</li>
                            </ul>
                        </li>
                    </ol>
                </div>
                <div>
                    <h5>Contact</h5>
                    Source code at <a href="https://gitlab.com/MichaelPrasil/awesome-bucket-list/">
                    <img alt="gitlab" src="https://about.gitlab.com/images/press/press-kit-icon.svg"
                         style={{height: "1.5ex", width: "1em"}}
                    />
                    MichealPrasil/awesome-bucket-list
                </a><br/>
                    To get in contact, please file an issue or write to one of us.
                    <ul className="browser-default">
                        <li><a href="https://gitlab.com/tost11">Lukas {"<toast11>"} Hagenhauer</a></li>
                        <li><a href="https://gitlab.com/goatfryed">Omar {"<goatfryed>"} Sood</a></li>
                        <li><a href="https://gitlab.com/Maggi64">Maximilian {"<Maggi64>"} Dewald</a></li>
                        <li><a href="https://gitlab.com/MichaelPrasil">Michael {"<MichaelPrasil>"} Prasil</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
}