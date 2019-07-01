package de.uniks.webengineering2019.bla.model;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Setter
@Getter
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

    private Date createnDate;
    private Date lastUpdated;

    public BucketList(){
    }

    public void addEntry(BucketListEntry newEntry){
        this.entries.add(newEntry);
        newEntry.setBucketList(this);
        this.numEntries = this.entries.size();
    }

}
