package de.uniks.webengineering2019.bla.model;

import javax.persistence.MappedSuperclass;
import java.util.List;

/**
 * @author Goatfryed
 * We want different entities to have a pool auf comments.
 * While we could use a MappedSuperclass and define mappings between [BucketList, BucketListEntry, Comment] -> Comment,
 * we can't make the comment the owning side, since there is no common base for it.
 * This setup (should?) lead(s) to the issue that we query the db once for every level of nesting.
 *
 * I want to test the following setup:
 * Comments should know about the master. that is a top level owner that is commented on. By querying for the master,
 * we could fetch all comments of an entity with a single query. Also, we can count the total comment count directly.
 * Comments know their parent.
 * By setting the relation to be bidirectional, it should be possible to query all comments of a master and let
 * the ORM popullate the Comment::comments relationship accordingly.
 * Open Question: How to tell JPA after fetching the nestedComments, that all Comment::comments relations should be treated
 * as initialized and not trigger another db request.
 *
 * The comment -> master relationship requires a common base for the Commentable Entities as well. Since i don't feel
 * well with making them all extend a single class just for this purpose, i tried going with a Superclass of just a Comment
 * and add a 1:1 relationship from the other entities to this comment container, thus doing something like composition over
 * inheritance
 */

@MappedSuperclass
public interface Commentable {

    List<Comment> getComments();

    //this is needet to know root bucketlist of comment, to deny acces when not priveleged to write comment to this list
    Long getCommentableRootListId();
}
