package de.uniks.webengineering2019.bla.model;

import java.util.Date;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;
import org.springframework.context.annotation.Lazy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

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
    private Integer voteCount;

    @JsonProperty("private")
    private boolean privateList;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "bucketList", orphanRemoval = true, cascade = CascadeType.REMOVE)
    @OrderBy("created DESC")
    private List<BucketListEntry> entries;
    private Integer numEntries;

    @ManyToMany(cascade = CascadeType.ALL)
    @JsonProperty("accessed")
    private Set<User> accessedUsers;

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private boolean ownList;
    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private boolean shared;

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
    @ManyToMany
    private List<User> userUpvote;
    @ManyToMany
    private List<User> userDownvote;

    // upvote and remove downvote
    public void upvote(User user) {
        if (this.userDownvote.contains(user)) {
            this.userDownvote.remove(user);
        }
        if (!this.userUpvote.contains(user)) {
            this.userUpvote.add(user);
        }
        countVotes();
    }

    // downvote and remove upvote
    public void downvote(User user) {
        if (this.userUpvote.contains(user)) {
            this.userUpvote.remove(user);
        }
        if (!this.userDownvote.contains(user)) {
            this.userDownvote.add(user);
        }
        countVotes();
    }
    //calculates votecout
    public void countVotes() {
        this.voteCount = this.userUpvote.size() - this.userDownvote.size();
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

    @Override
    @JsonIgnore
    public Long getCommentableRootListId() {
        return this.getId();
    }
}
