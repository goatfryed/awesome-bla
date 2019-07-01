package de.uniks.webengineering2019.bla.model;

import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@Entity
public class BucketListEntry {

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // See JavaDoc for explanation.
    private Long id;

    private String title;

    private Date created;
    private Date updated;
    private Date completed;

    /*
        avoid infinite recursion in generated json of bidirectional relationships by using JsonIdentityInfo
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    private BucketList bucketList;

    @OneToOne
    @JsonIgnore
    @Builder.Default
    private Commentable commentBoard = new Commentable();

    public BucketListEntry()
    {

    }

    @JsonProperty
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public List<Comment> getComments()
    {
        if (commentBoard == null) {
            return null;
        }
        return commentBoard.comments;
    }
}
