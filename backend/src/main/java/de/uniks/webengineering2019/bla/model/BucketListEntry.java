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
public class BucketListEntry implements Commentable {

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // See JavaDoc for explanation.
    private Long id;

    private String title;
    private String description;

    private Date created;
    private Date updated;
    private Date completed;

    /*
        avoid infinite recursion in generated json of bidirectional relationships by using JsonIdentityInfo
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private BucketList bucketList;

    @OneToMany
    @OrderBy("created DESC")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<Comment> comments;

    public BucketListEntry()
    {
        this.created = new Date();
    }

    @JsonProperty
    public List<Comment> getComments()
    {
        return comments;
    }
}
