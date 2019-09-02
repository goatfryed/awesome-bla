package de.uniks.webengineering2019.bla.model;

import java.util.Date;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

import javax.persistence.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(catalog = "bucketlist")
public class BucketList implements Commentable {

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // See JavaDoc for explanation.
    private Long id;

    private String title;
    private String description;

    @JsonProperty("private")
    private boolean privateList;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "bucketList", orphanRemoval = true, cascade = CascadeType.REMOVE)
    @OrderBy("created DESC")
    private List<BucketListEntry> entries;
    private int numEntries;

    @ManyToMany(cascade = CascadeType.ALL)
    @JsonProperty("accessed")
    private Set<User> accessedUsers;

    @Transient
    private boolean ownList;

    @ManyToOne
    @JoinColumn(name="owner_id",nullable = false)
    private User owner;

    @JsonProperty("created")
    private Date creationDate;
    private Date lastUpdated;

    public void addEntry(BucketListEntry newEntry){
        this.entries.add(newEntry);
        newEntry.setBucketList(this);
        this.numEntries = this.entries.size();
    }
    @OneToMany
    private List<User> userUpvote;
    @OneToMany
    private List<User> userDownvote;

    private int voteCount;

    // upvote and remove downvote
    public void upvote(User user) {
        if (!this.userUpvote.contains(user)) {
            this.userUpvote.add(user);
        }
        if (this.userDownvote.contains(user)) {
            this.userDownvote.remove(user);
        }
        countVotes();
    }

    // downvote and remove upvote
    public void downvote(User user) {
        if (this.userUpvote.contains(user)) {
            this.userUpvote.add(user);
        }
        if (!this.userDownvote.contains(user)) {
            this.userDownvote.remove(user);
        }
        countVotes();
    }

    public int countVotes() {
        this.voteCount = this.userUpvote.size() + this.userDownvote.size();
        return this.voteCount;
    }

    @OneToMany
    @OrderBy("created DESC, id ASC")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<Comment> comments;

    @JsonProperty
    public List<Comment> getComments()
    {
        return comments;
    }
}
