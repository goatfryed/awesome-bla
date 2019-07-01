package de.uniks.webengineering2019.bla.model;

import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import java.util.Date;

/**
 * For now, I'd like to try to store a reference to the master topic, e.g. bucketlist or bucketlistentry so
 * that we can fetch all associated comments with one request.
 * additionally, i'll store a reference to the direct parent
 */
@Setter
@Getter
@Builder
@AllArgsConstructor
@Entity
public class Comment extends Commentable {

    private Date created;

    @Column(length = 4096)
    private String comment;

    @ManyToOne
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    private Commentable master;

    @ManyToOne
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    private Commentable parent;

    @PrePersist
    public void init() {
        if (created == null) {
            created = new Date();
        }
    }

    public Comment () {

    }
}
