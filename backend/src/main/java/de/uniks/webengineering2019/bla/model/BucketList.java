package de.uniks.webengineering2019.bla.model;

import java.util.Date;
import java.util.List;

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
@Table(catalog="bucketlist")
public class BucketList{

    @Id
    @GeneratedValue
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // See JavaDoc for explanation.
    private Long id;
    private String title;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "bucketList")
    @OrderBy("created DESC")
    private List<BucketListEntry> entries;
    private int numEntries;

    @JsonProperty("created")
    private Date createnDate;
    private Date lastUpdated;

    public void addEntry(BucketListEntry newEntry){
        this.entries.add(newEntry);
        newEntry.setBucketList(this);
        this.numEntries = this.entries.size();
    }

    @OneToMany
    @OrderBy("created DESC")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<Comment> comments;

    @JsonProperty
    public List<Comment> getComments()
    {
        return comments;
    }
}
