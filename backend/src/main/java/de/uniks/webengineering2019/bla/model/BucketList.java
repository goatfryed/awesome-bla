package de.uniks.webengineering2019.bla.model;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

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

    @OneToMany
    @OrderBy("created DESC")
    private List<BucketListEntry> entries;
    private int numEntries;

    private Date createnDate;
    private Date lastUpdated;

    public BucketList(){
    }

    public void addEntry(BucketListEntry newEntry){
        this.entries.add(newEntry);
        this.numEntries = this.entries.size();
    }

}
